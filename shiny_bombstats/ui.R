library(shiny)
library(shinythemes)
library(networkD3)

shinyUI(fluidPage(theme = shinytheme("flatly"),

  titlePanel("Macedonia wiretapping data"),
  
  tabsetPanel(
    tabPanel("Data",
      sidebarLayout(
        sidebarPanel(width = 3,
          strong("Inventory of publicly released conversations. 
                  As of now incomplete.
                  Detailed explanation will be added shortly"),
          tags$hr(),
          strong("Листа на јавно објавени разговори.
                  Во моментов не целосни.
                  Детално објаснување ќе биде додадено наскоро.")),
        
        mainPanel(width = 9,
                  dataTableOutput("Table"))
      )
    ),
    
    tabPanel("Network",
      sidebarLayout(
        sidebarPanel(width = 3,
          strong("Network representation of conversations. 
                  Detailed explanation here."),
          tags$hr(),
          strong("Мрежна презентација на разговорите.
                  Детално објаснување тука."),
          tags$hr(),
          radioButtons("color_by", "Color by: ",
                       choices=list("Political affiliation" = "Party",
                                    "Political role"= "Role"),
                       selected="Party")),
               
        mainPanel(width = 9,
                  forceNetworkOutput("Force", height = 700, width=1000))
      )
    )
  )
))