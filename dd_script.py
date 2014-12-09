from open import ocpu_wrapper
import requests

files = {'data': open('counts.csv','r').read()}
d = ocpu_wrapper(url='http://localhost/ocpu/library/rlines/R/store_csv/',  files=files)
d.perform()
header = {
        'content-type': 'application/x-www-form-urlencoded'
        }
data = 'target.region="baltimore"&comparison.region.set=c("dc","nova")&event.date="2014-01-01"&input_data=%s' % d.get_result_pointer()
#data = 'data=%s' % d.session_id
print('Passing data: %s' % data)
e = ocpu_wrapper(url='http://localhost/ocpu/library/rlines/R/diffindiff_data/',   data= data, header=header)
e.perform()

f = requests.get('http://localhost/ocpu/tmp/%s/R/.val/json' % e.session_id)
print(f.json())
