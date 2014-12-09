from helpers import ocpu_wrapper
import helpers
import requests

files = {'data': open('counts.csv','r').read()}
d = ocpu_wrapper(url='http://localhost/ocpu/library/rlines/R/store_csv/',  files=files)
d.perform()
header = {
        'content-type': 'application/x-www-form-urlencoded'
        }
data = {
        'target.region':"baltimore",
        'comparison.region.set':["dc","nova"],
        'event.date':"2014-01-01",
        'input_data':d
        }
data_str = helpers.dict_to_r_args(data)
#data_str = helpers.dict_to_r_args(data) + '&input_data=%s' % d.get_result_pointer()
        
#data = 'target.region="baltimore"&comparison.region.set=c("dc","nova")&event.date="2014-01-01"&input_data=%s' % d.get_result_pointer()
#data = 'data=%s' % d.session_id
print('Passing data: %s' % data_str)
e = ocpu_wrapper(url='http://localhost/ocpu/library/rlines/R/diffindiff_data/',   data= data_str, header=header)
e.perform()

f = requests.get('http://localhost/ocpu/tmp/%s/R/.val/json' % e.session_id)
print(f.json())
