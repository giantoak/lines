#' Take 
#' 
#' @param target.region: The region of interest, matching a backpage domain
#' @param comparison.region.set: A set of regions (e.g. c('nova','abilene')) to compare to
#' @return A dataframe with 'MonthDate', 'target' and 'comparison' columns

twolines<-function(target.region, comparison.region.set){
  output<-counts[counts$region == target.region,c('MonthDate','counts')]
  names(output)<-c('MonthDate','target')
  print(dim(output))
  comparison<-counts[counts$region %in% comparison.region.set,c('MonthDate','counts')]
  print(dim(comparison))
  names(comparison)<-c('MonthDate','comparison')
  output<-merge(output,comparison)
  
  
  return(output)
}