#' Take region names and a comparison date and does diff-in-diff
#' 
#' @param target.region: The region of interest, matching a backpage domain
#' @param comparison.region.set: A set of regions (e.g. c('nova','abilene')) to compare to
#' @param event.date: a YYYY-MM-DD date string for the actual event date
#' @param logged: A boolean as to whether to perform a log transform on the data first
#' @return A list with dd, main_diff, comparison_diff, pre, and post values



diffindiff<-function(target.region, comparison.region.set, event.date, logged=FALSE){
  data=twolines(target.region=target.region, comparison.region.set=comparison.region.set)
  data$date<-as.Date(data$MonthDate, "%Y-%m-%d")
  data$MonthDate <-NULL
  
  ed<-as.Date(event.date, "%Y-%m-%d")
  
  data$post = data$date > ed
  data<-melt(data, id=c("date","post"), variable.name="group", value.name="counts")
  if (logged){
    data$counts<-log(1+data$counts)
  }
  model<-lm(counts ~ post*group, data=data)
  print(summary(model))
  model.results<-coef(summary(model))
  vcov.matrix<-vcov(model)
  dd<-list(
    b=model.results[4,'Estimate'], 
    se=model.results[4, "Std. Error"],
    t=model.results[4,"t value"] 
  )
  # The diff-in-diff estimate
  target.change<-
    list(
      b=model.results[1,'Estimate'], 
      se=model.results[1, "Std. Error"],
      t=model.results[1,"t value"]
    )# The pre-post difference in the target variable
  comparison.vec<-c(1,0,0,1)
  # The comparison group is the sum of the 1st and 4th variables
  b.comparison<-comparison.vec %*% model.results[,'Estimate']
  se.comparison<-sqrt(comparison.vec %*% vcov.matrix %*% comparison.vec)
  comparison.change<-list(
    b=b.comparison,
    se=se.comparison,
    t=b.comparison/se.comparison
    )
  
  #comparison.change<-mean(data[data$group == "comparison" & data$post,'counts']) - mean(data[data$group == "comparison" & data$post == FALSE,'counts'])
  comparison<-data[data$group == "Comparison",c('date','counts')]
  comparison$date <- strftime(comparison$date,"%Y-%m-%d")
  target<-data[data$group == "Target",c('date','counts')]
  target$date <- strftime(target$date,"%Y-%m-%d")
  data<-reshape2::dcast(data=data, formula=date~group, value=counts)
  return(list(data=data,
              comparison=comparison,
              target=target,
              #model=model, 
              diff.in.diff=dd, 
              target.diff=target.change, 
              comparison.diff=comparison.change))
}