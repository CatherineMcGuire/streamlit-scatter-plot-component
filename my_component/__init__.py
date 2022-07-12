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
# plot_name_holder.write(f"Clicked Point: {clickedPoint}")

# TABLE

table_data = {'x': x, 'y': y}
table_df =  pd.DataFrame(data=table_data)
st.write(table_df);

# Default - present all data points

# if Points[0]['event_type'] == 'init':
#     data = Points
#     x_values = Points[0]['x_values']
#     y_values = Points[0]['y_values']
#     init_df = pd.DataFrame(data=Points[0])
#     table_df = init_df[["x_values", "y_values"]].rename(columns={"x_values" : "x", "y_values" : "y"})
#     st.write(table_df);

# Zoom to select data set

# elif Points[0]['event_type'] == 'relayout':
#     st.write(Points);

# # Click to compare dataset]

# elif Points[0]['event_type'] == 'select':
#     st.write('SELECT');

# else:
#     st.write('NONE');

