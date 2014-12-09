import unittest
import requests
import json
import ipdb

# These tests are based off of the existing data in the rlines package
# from openads
class ocpu_wrapper():
    def __init__(self, url, baseurl = 'http://localhost', header={}, files={}, data=''):
        if 'http' in url:
            self.url=url
        else:
            self.url= baseurl + url
        self.baseurl = baseurl
        self.header = header
        self.files = files
        self.data = data
        #self.result = None
        #self.session_id = None
    def perform(self):
        print('Calling %s' % self.url)
        self.result = requests.post(self.url, files=self.files, headers=self.header, data=self.data)
        # perform the initial search
        if self.result.status_code == 400:
            print('Error: %s' % self.result.text)
        self.result.raise_for_status()

        self.endpoints = self.result.text.split('\n')
        # Set the list of endpoints
        self.session_id = self.endpoints[0][10:21]
        # Get the session ID
    def get_result_object(self, format='json'):
        """
        Gets the result object of this call as a json object
        """
        if not self.result:
            raise(NameError('Search not performed!'))
        req = requests.get(self.baseurl + '/ocpu/tmp/' + self.session_id + '/R/.val/' + format)
        req.raise_for_status()
        return req.json()
    def get_result_pointer(self):
        return self.session_id + '::.val'

def call_r(endpoint, files={}, header={}, data=''):
    """
    Call endpoint and receive link to data object
    """
    if data:
        header = {
                'content-type': 'application/x-www-form-urlencoded'
                }
    api = ocpu_wrapper(files=files, header=header, url=endpoint, data = data)
    api.perform()
    return api.session_id + "::.val"

def get_from_val(session,endpoint='/ocpu/tmp/'):
    """
    Take a session object like 'x4abe33184::.val' and does a 'get' on the json of the object

    This would work with just 'x4abe33184' as well
    """
    if ':' in session:
        session_id = session.split(':')[0]
    #api = ocpu_wrapper(url=endpoint + session_id + '/R/.val')
    r = requests.get('http://localhost' + endpoint + session_id + '/R/.val/json')
    r.raise_for_status()
    #api.perform()
    return r.json()

#if __name__ == '__main__':
    #unittest.main()
