import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"
import Plot from 'react-plotly.js';

class MyComponent extends StreamlitComponentBase<State> {
  public state = {data: [], layout: {}, frames: [], config: {}, style: {}, className: "" }

  public render = (): ReactNode => {

    // Pull Plotly object from args and parse
    const plot_obj = JSON.parse(this.props.args["plot_obj"]);
    const override_height = this.props.args["override_height"];
    const override_width = this.props.args["override_width"];

    // Event booleans
    const click_event = this.props.args["click_event"];
    const select_event = this.props.args["select_event"];
    const hover_event = this.props.args["hover_event"];
    const relay_event = this.props.args["relay_event"];

    Streamlit.setFrameHeight(override_height);

    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.
    // const name = this.props.args["name"]
    // const greeting = this.props.args["greeting"]

    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    // const { theme } = this.props
    // const style: React.CSSProperties = {}

    // // Maintain compatibility with older versions of Streamlit that don't send
    // // a theme object.
    // if (theme) {
    //   // Use the theme object to style our button border. Alternatively, the
    //   // theme style is defined in CSS vars.
    //   const borderStyling = `1px solid ${
    //     this.state.isFocused ? theme.primaryColor : "gray"
    //   }`
    //   style.border = borderStyling
    //   style.outline = borderStyling
    // }

    // Show a button and some text.
    // When the button is clicked, we'll increment our "numClicks" state
    // variable, and send its new value back to Streamlit, where it'll
    // be available to the Python program.
    return (
      // <span>
      //   {greeting}, {name}! &nbsp;
      //   <button
      //     style={style}
      //     onClick={this.onClicked}
      //     disabled={this.props.disabled}
      //     onFocus={this._onFocus}
      //     onBlur={this._onBlur}
      //   >
      //     Click Me!
      //   </button>
      // <span>
    //     <Plot
    //     onClick={this.onClicked}
    //     // onSelected={this.onSelected}
    //    data={[
    //      {
    //        x: [1, 2, 3],
    //        y: [2, 6, 3],
    //        type: 'scatter',
    //        mode: 'markers',
    //        marker: {color: 'red'},
    //      },
    //      {
    //       x: [4, 3, 1],
    //       y: [3, 6, 2],
    //       type: 'scatter',
    //       mode: 'markers',
    //       marker: {color: 'blue'},
    //     },
    //    ]}
    //    layout={ {title: 'Scatter Plot'} }
    //     onRelayout={this.onRelayout}
       
    //  />
    <Plot
        data={plot_obj.data}
        layout={plot_obj.layout}
        config={plot_obj.config}
        frames={plot_obj.frames}
        onClick={click_event ? this.plotlyEventHandler : function(){}}
        onSelected={select_event ? this.plotlyEventHandler : function(){}}
        onRelayout={relay_event ? this.onRelayout : function(){}}
        onHover={hover_event ? this.plotlyEventHandler : function(){}}
        style={{width: override_width, height: override_height}}
        className="stPlotlyChart"
      />
      // </span>


    )
  }

  private plotlyEventHandler = (data: any) => {
    // Build array of points to return
    var clickedPoints: Array<any> = [];
    data.points.forEach(function (arrayItem: any) {
      clickedPoints.push({
        x: arrayItem.x,
        y: arrayItem.y,
        curveNumber: arrayItem.curveNumber,
        pointNumber: arrayItem.pointNumber,
        pointIndex: arrayItem.pointIndex
      })
    });

    // Return array as JSON to Streamlit
    Streamlit.setComponentValue(JSON.stringify(clickedPoints))
  }
  onRelayout = (data): any => {
    // private onClicked = (): void => {
      // Increment state.numClicks, and pass the new value back to
      // Streamlit via `Streamlit.setComponentValue`.
    //   this.setState(
    //     prevState => ({ numClicks: prevState.numClicks + 1 }),
    //     () => Streamlit.setComponentValue(this.state.numClicks)
    //   )
    // }
    var relayoutPoints: Array<any> = [];

      relayoutPoints.push({
        event_type: 'relayout',
        xaxis0: data['xaxis.range[0]'],
        xaxis1: data['xaxis.range[1]'],
        yaxis0: data['yaxis.range[0]'],
        yaxis1: data['yaxis.range[1]'],
      });

    // Return array as JSON to Streamlit
    Streamlit.setComponentValue(JSON.stringify(relayoutPoints))
  }
}

//   /** Click handler for our "Click Me!" button. */
//   private onClicked = (data: { points: any[]; }): any => {
//   // private onClicked = (): void => {
//     // Increment state.numClicks, and pass the new value back to
//     // Streamlit via `Streamlit.setComponentValue`.
//   //   this.setState(
//   //     prevState => ({ numClicks: prevState.numClicks + 1 }),
//   //     () => Streamlit.setComponentValue(this.state.numClicks)
//   //   )
//   // }
//   var clickedPoints: Array<any> = [];
//   data.points.forEach(function (arrayItem: any) {
//     clickedPoints.push({
//       event_type: 'click',
//       x: arrayItem.x,
//       y: arrayItem.y,
//       curveNumber: arrayItem.curveNumber,
//       pointNumber: arrayItem.pointNumber,
//       pointIndex: arrayItem.pointIndex
//     })
//   });

//   // Return array as JSON to Streamlit
//   Streamlit.setComponentValue(JSON.stringify(clickedPoints))
// }

// private onSelected = (data: { points: any[]; }): any => {
//   // private onClicked = (): void => {
//     // Increment state.numClicks, and pass the new value back to
//     // Streamlit via `Streamlit.setComponentValue`.
//   //   this.setState(
//   //     prevState => ({ numClicks: prevState.numClicks + 1 }),
//   //     () => Streamlit.setComponentValue(this.state.numClicks)
//   //   )
//   // }
//   var selectedPoints: Array<any> = [];
//   data.points.forEach(function (arrayItem: any) {
//     selectedPoints.push({
//       x: arrayItem.x,
//       y: arrayItem.y,
//       curveNumber: arrayItem.curveNumber,
//       pointNumber: arrayItem.pointNumber,
//       pointIndex: arrayItem.pointIndex
//     })
//   });

//   // Return array as JSON to Streamlit
//   Streamlit.setComponentValue(JSON.stringify(selectedPoints))
// }



  /** Focus handler for our "Click Me!" button. */
  // private _onFocus = (): void => {
  //   this.setState({ isFocused: true })
  // }

  /** Blur handler for our "Click Me!" button. */
//   private _onBlur = (): void => {
//     this.setState({ isFocused: false })
//   }
// }

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(MyComponent)
