from django.shortcuts import render
from django.template import RequestContext, loader  
from django.conf import settings
from django.http import HttpResponse
from tempus.helpers import ocpu_wrapper
from tempus.helpers import dict_to_r_args
import json
import ipdb

def home(request):
    template = loader.get_template('tempus/metrics_jeff.js')
    output = {} # No data here
    context = RequestContext(request, output)
    return HttpResponse( template.render(context))

def get_comparison(request):
    if not request.META['CONTENT_TYPE'] == 'application/json':
        return HttpResponse(json.dumps({'Error':'JSON not received'},mimetype='application/json'))
    input_data = json.loads(request.body)
    data = { 'target.region':str(input_data['targetRegion']) }
    header = { 'content-type': 'application/x-www-form-urlencoded' }
    url = url=settings.OPENCPU_ENDPOINT + 'ocpu/library/rlines/R/get_features/'
    d = ocpu_wrapper(url=url, data=dict_to_r_args(data), header=header)
    d.perform()

    return HttpResponse(json.dumps(d.get_result_object()),mimetype='application/json')

