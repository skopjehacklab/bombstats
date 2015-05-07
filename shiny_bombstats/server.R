library(shiny)
library(networkD3)

Data <- read.csv("./data/v2_released-conversations.csv", header=TRUE)
colnames(Data) <- c("Date", "Number", "Caller", "Caller affiliation", "Caller role", "Callee", "Callee affiliation", "Callee role")

Links <- read.csv("./data/Links.csv", header=TRUE)
Nodes <- read.csv("./data/Nodes.csv", header=TRUE)
  
shinyServer(function(input, output) {
  
  output$Table <- renderDataTable({
    Data
  }, options = list(pageLength = 10))
  
  plotFN <- function(lns, nds) {
    forceNetwork(Links = Links, Nodes = Nodes,
                 Source = "Source", Target = "Target",
                 Value = "Value", NodeID = "Name",
                 Group = input$color_by, opacity = 1,
                 fontsize=12, linkDistance=100)
  }
    
  output$Force <- renderForceNetwork({
    #Datasets <- whichSubset()
    #Links <- Datasets[1]
    #Nodes <- Datasets[2]
    plotFN(lns=Links, nds=Nodes)
  })
  
})
