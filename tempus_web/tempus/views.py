from django.shortcuts import render
from django.template import RequestContext, loader  
from django.http import HttpResponse
import json
import ipdb

def home(request):
    template = loader.get_template('tempus/metrics_jeff.js')
    output = {} # No data here
    context = RequestContext(request, output)
    return HttpResponse( template.render(context))

def get_comparison(request):
    print(request.POST)
    return HttpResponse(json.dumps(request.POST),mimetype='application/json')

