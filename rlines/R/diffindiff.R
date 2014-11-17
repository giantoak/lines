#' Take region names and a comparison date and does diff-in-diff
#' 
#' @param target.region: The region of interest, matching a backpage domain
#' @param comparison.region.set: A set of regions (e.g. c('nova','abilene')) to compare to
#' @param event.date: a YYYY-MM-DD date string for the actual event date
#' @return A list with dd, main_diff, comparison_diff, pre, and post values



diffindiff<-function(target.region, comparison.region.set, event.date){
  data=twolines(target.region=target.region, comparison.region.set=comparison.region.set)
  data$DateTime<-as.Date(data$MonthDate, "%Y-%m-%d")
  data$MonthDate <-NULL
 
  ed<-as.Date(event.date, "%Y-%m-%d")
  data$post = data$DateTime > ed
  data<-melt(data, id=c("DateTime","post"), variable.name="group", value.name="counts")
  model<-lm(counts ~ post*group, data=data)
  print(summary(model))
  dd<-coef(model)[4] # The diff-in-diff estimate
  target.change<-coef(model)[1]
  #target.change<-mean(data[data$group == "target" & data$post,'counts']) - mean(data[data$group == "target" & data$post == FALSE,'counts'])
  comparison.change<-coef(model)[1] + coef(model)[4] 
  #comparison.change<-mean(data[data$group == "comparison" & data$post,'counts']) - mean(data[data$group == "comparison" & data$post == FALSE,'counts'])
  comparison<-data[data$group == "Comparison",c('DateTime','counts')]
  comparison$DateTime <- strftime(comparison$DateTime,"%Y-%m-%d")
  target<-data[data$group == "Target",c('DateTime','counts')]
  target$DateTime <- strftime(target$DateTime,"%Y-%m-%d")
  data<-reshape2::dcast(data=data, formula=DateTime~group, value=counts)
  return(list(data=data,
              comparison=comparison,
              target=target,
              #model=model, 
              diff.in.diff=dd, 
              target.diff=target.change, 
              comparison.diff=comparison.change))
}