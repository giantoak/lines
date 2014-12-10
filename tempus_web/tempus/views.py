from django.shortcuts import render
from django.template import RequestContext, loader
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse_lazy
from tempus.helpers import ocpu_wrapper
from tempus.helpers import dict_to_r_args
from tempus.forms import TimeSeriesFileForm
import datetime
import json
import ipdb

def home(request):
    template = loader.get_template('tempus/metrics_jeff.js')
    output = {} # No data here
    context = RequestContext(request, output)
    return HttpResponse( template.render(context))

def upload(request):
    if request.method == 'POST':
        # We have a file, so save it
        form = TimeSeriesFileForm(request.POST, request.FILES)
        batch = form.save()
        return HttpResponseRedirect(reverse_lazy('upload_home'))
    else:
        output = {'form':TimeSeriesFileForm()}
        template = loader.get_template('tempus/metrics_jeff_upload.js')
        context = RequestContext(request, output)
        return HttpResponse( template.render(context))

def get_comparison(request):
    start = datetime.datetime.now()
    if not request.META['CONTENT_TYPE'] == 'application/json':
        return HttpResponse(json.dumps({'Error':'JSON not received'},mimetype='application/json'))
        # Check if we are sending JSON as the body here, and if not, error!
        # Note. This is not necessarily the *RIGHT* way to send json in the body
        # of an http request..
    input_data = json.loads(request.body)
    data = { 'target.region':str(input_data['targetRegion']) }# Convert input data from unicode
    header = { 'content-type': 'application/x-www-form-urlencoded' } # Set header for ocpu
    url = url=settings.OPENCPU_ENDPOINT + 'ocpu/library/rlines/R/get_features/'
    print('About to create ocpu object in %s' % str(datetime.datetime.now() - start))
    d = ocpu_wrapper(url=url, data=dict_to_r_args(data), header=header)
    print(' ocpu object created in %s' % str(datetime.datetime.now() - start))
    d.perform()
    print('Main query performed in %s' % str(datetime.datetime.now() - start))

    return HttpResponse(json.dumps(d.get_result_object()),mimetype='application/json')

def diffindiff(request):
    start = datetime.datetime.now()
    if not request.META['CONTENT_TYPE'] == 'application/json':
        return HttpResponse(json.dumps({'Error':'JSON not received'},mimetype='application/json'))
        # Check if we are sending JSON as the body here, and if not, error!
        # Note. This is not necessarily the *RIGHT* way to send json in the body
        # of an http request..
    input_data = json.loads(request.body)
    data = {
            'target.region':str(input_data['targetRegion']),
            'comparison.region.set':[str(i) for i in input_data['comparisonRegionSet']],
            'event.date':str(input_data['eventDate']),
            }# Convert input data from unicode
    if input_data.has_key('logged'):
        data['logged'] = input_data['logged']
    header = { 'content-type': 'application/x-www-form-urlencoded' } # Set header for ocpu
    url = url=settings.OPENCPU_ENDPOINT + 'ocpu/library/rlines/R/diffindiff/'
    print('About to create ocpu object in %s' % str(datetime.datetime.now() - start))
    print(dict_to_r_args(data))
    d = ocpu_wrapper(url=url, data=dict_to_r_args(data), header=header)
    print(' ocpu object created in %s' % str(datetime.datetime.now() - start))
    d.perform()
    print('Main query performed in %s' % str(datetime.datetime.now() - start))

    return HttpResponse(json.dumps(d.get_result_object()),mimetype='application/json')

def save_ts_csv(request):
    form = TimeSeriesFileForm(request.POST, request.FILES)
    ipdb.set_trace()


