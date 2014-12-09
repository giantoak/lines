import unittest
import requests
import json
import ipdb

# These tests are based off of the existing data in the rlines package
# from openads
class ocpu_wrapper():
    baseurl = 'http://localhost'
    def __init__(self, url, header={}, files={}):
        if 'http' in url:
            self.url=url
        else:
            self.url=self.baseurl + url
        self.result = None
        self.header = header
        self.files = files
        self.session_id = None
    def perform(self):
        self.result = requests.post(self.url, files=self.files, headers=self.header)
        # perform the initial search
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

#if __name__ == '__main__':
    #unittest.main()
