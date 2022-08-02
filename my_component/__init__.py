import streamlit.components.v1 as components
import streamlit as st
from json import loads
import streamlit as st
import plotly.graph_objects as go
import pandas as pd

_my_component = components.declare_component(
    "my_component",
    url="http://localhost:3001/"
)

def scatter_events(
    plot_fig,
    click_event=True,
    select_event=True,
    hover_event=False,
    relay_event=True,
    init=True,
    override_height=450,
    override_width="100%",
    key=None,
    ):

    return_value = _my_component(
        plot_obj=plot_fig.to_json(),
        override_height=override_height,
        override_width=override_width,
        key=key,
        click_event=click_event,
        select_event=select_event,
        hover_event=hover_event,
        relay_event=relay_event,
        init=init,
        default="[]",  # Default return empty JSON list
    )

    return loads(return_value)

st.set_page_config(layout="wide")

st.subheader("Plotly Scatter Chart")

# DEFINE PLOT  

x = [0, 6, 2, 9]
y = [0, 1, 8, 3]

trace= go.Scatter(
    x = x, 
    y = y,
    mode = 'markers'
    )
fig = go.Figure([trace])
fig.layout.uirevision = True 


# RENDER PLOT

plot_name_holder = st.empty()
Points = scatter_events(fig, key="line")

# SELECT DATA

# Default - present all data points in table

table_data = {'x': x, 'y': y}
table_df =  pd.DataFrame(data=table_data)

# Zoom / Pan to select data

if Points[0]['event_type'] == 'relayout':

    # st.write(len(Points[0]))

    
    relayout_x0 = [Points[0]["xaxis0"]] if "xaxis0" in Points[0].keys() else [min(table_df['x'])]
    relayout_x1 = [Points[0]["xaxis1"]] if "xaxis1" in Points[0].keys() else [max(table_df['x'])]
    relayout_y0 = [Points[0]["yaxis0"]] if "yaxis0" in Points[0].keys() else [min(table_df['y'])]
    relayout_y1 = [Points[0]["yaxis1"]] if "yaxis1" in Points[0].keys() else [max(table_df['y'])]

    table_df = table_df.loc[
        (table_df['x'] >= relayout_x0[0]) & 
        (table_df['x'] <= relayout_x1[0]) &
        (table_df['y'] >= relayout_y0[0]) &
        (table_df['y'] <= relayout_y1[0])
        ]

# Click to select data

if Points[0]['event_type'] == 'select':
    select_x = [Points[0]["x"]]
    select_y = [Points[0]["y"]]
    select_data = {'x': select_x, 'y': select_y}
    table_df = pd.DataFrame(data=select_data)

# TABLE OF SELECTED DATA

table_fig = go.Figure(data=[go.Table(
            header=dict(
                values=[
                '<b>x</b>',
                '<b>y</b>',
                ],
                        ),
            cells=dict(values=[
                table_df['x'],
                table_df['y'],
                ],
                    fill_color=[['#f2f2f2','white']*100],
                    height=30,
                    align='left'))
        ])

table_fig.update_layout(
        autosize=True,
        height=900,
        margin=dict(l=75,r=75,b=1,t=1),
        )

st.plotly_chart(table_fig, use_container_width=True)
