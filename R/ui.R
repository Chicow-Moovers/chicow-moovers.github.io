
page_one_sidepanel <- sidebarPanel(
  
  selectInput("planet_choose",
              label = "Choose a Body to see travel to from Earth:",
              choices = c("Mercury", "Venus", "Mars", "Jupiter", "Saturn", 
                          "Uranus", "Neptune", "Pluto", "Moon"),
              selected = "Mercury"
  ),
  textOutput(
    outputId = "planet_animation",
  )
)