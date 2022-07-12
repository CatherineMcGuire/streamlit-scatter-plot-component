import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"
import Plot from 'react-plotly.js';

class MyComponent extends StreamlitComponentBase {

  public render = (): ReactNode => {

    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.

    // Pull Plotly object from args and parse
    const plot_obj = JSON.parse(this.props.args["plot_obj"]);
    const override_height = this.props.args["override_height"];
    const override_width = this.props.args["override_width"];

    // Event booleans
    const click_event = this.props.args["click_event"];
    const select_event = this.props.args["select_event"];
    const hover_event = this.props.args["hover_event"];
    const relay_event = this.props.args["relay_event"];
    const init = this.props.args["init"];

    Streamlit.setFrameHeight(override_height);

    return (
     
    <Plot
        data={plot_obj.data}
        layout={plot_obj.layout}
        config={plot_obj.config}
        frames={plot_obj.frames}
        onClick={click_event ? this.plotlyEventHandler : function(){}}
        onSelected={select_event ? this.plotlyEventHandler : function(){}}
        onRelayout={relay_event ? this.onRelayout : function(){}}
        onHover={hover_event ? this.plotlyEventHandler : function(){}}
        onInitialized={init ? this.onInit : function(){}}
        style={{width: override_width, height: override_height}}
        className="stPlotlyChart"
      />
    )
  }

  private plotlyEventHandler = (data: any) => {
    // Build array of points to return
    var clickedPoints: Array<any> = [];
    data.points.forEach(function (arrayItem: any) {
      clickedPoints.push({
        event_type: 'select',
        x: arrayItem.x,
        y: arrayItem.y,
        curveNumber: arrayItem.curveNumber,
        pointNumber: arrayItem.pointNumber,
        pointIndex: arrayItem.pointIndex
      })
    });

    // Return array as JSON to Streamlit via `Streamlit.setComponentValue
    Streamlit.setComponentValue(JSON.stringify(clickedPoints))
  }
  
  onRelayout = (data: { [x: string]: any; }): any => {
    
    var relayoutPoints: Array<any> = [];

      relayoutPoints.push({
        event_type: 'relayout',
        xaxis0: data['xaxis.range[0]'],
        xaxis1: data['xaxis.range[1]'],
        yaxis0: data['yaxis.range[0]'],
        yaxis1: data['yaxis.range[1]'],
      });

    // Return array as JSON to Streamlit via `Streamlit.setComponentValue
    Streamlit.setComponentValue(JSON.stringify(relayoutPoints))
  }

  private onInit = (data) => {

    var allPoints: Array<any> = [];

    allPoints.push({
      event_type: 'init',
      x_values: data.data[0]['x'],
      y_values: data.data[0]['y']
    });


    // Return array as JSON to Streamlit via `Streamlit.setComponentValue
    Streamlit.setComponentValue(JSON.stringify(allPoints))
  }


}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(MyComponent)
