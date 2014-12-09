#' Take region names and lookup series from a panel
#' 
#' @param target.region: The region of interest, matching a backpage domain
#' @param comparison.region.set: A set of regions (e.g. c('nova','abilene')) to compare to
#' @param data: The data frame to split up - needs columns 'region', 'MonthDate', and 'counts'
#' @return A dataframe with 'MonthDate', 'target' and 'comparison' columns



twolines_data<-function(target.region, comparison.region.set, data){

  output<-data[data$region == target.region,c('MonthDate','counts')]
  names(output)<-c('MonthDate','Target')
  comparison<-data[data$region %in% comparison.region.set,c('MonthDate','counts')]
  comparison<-ddply(comparison, .(MonthDate), function(x) {sum(x$counts)})
  names(comparison)<-c('MonthDate','Comparison')
  output<-merge(output,comparison)
  return(output)
}