library(dplyr)
library(styler)
library(lintr)
source("/data.csv")

df <- read.csv("data.csv", stringsAsFactors = FALSE)
  
server <- function(input, output) {
  output$planet_animation <- renderText({
    planet_isolate <- df %>%
    filter(Planet == input$planet_choose) %>%
    select(Planet,Distanc, Time)
  message <- paste0(
    "It will take ", planet_isolate$Time, 
    " to reach ", input$planet_choose, "."
  )
  return(message)
})
}