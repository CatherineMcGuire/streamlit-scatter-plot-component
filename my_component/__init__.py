import streamlit.components.v1 as components
import streamlit as st
from json import loads
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

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
        default="[]",  # Default return empty JSON list
    )

    return loads(return_value)

st.set_page_config(layout="wide")

st.subheader("Plotly Scatter Chart")

    

trace= go.Scatter(
    x = [0, 1, 2, 3], 
    y = [0, 1, 2, 3],
    mode = 'markers'
    )
fig = go.Figure([trace])
fig.layout.uirevision = True 
plot_name_holder = st.empty()
clickedPoint = scatter_events(fig, key="line")
plot_name_holder.write(f"Clicked Point: {clickedPoint}")
