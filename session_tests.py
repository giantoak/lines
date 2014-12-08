import unittest
import requests
import json
import ipdb

# These tests are based off of the existing data in the rlines package
# from openads
class TestSession(unittest.TestCase):
    # One test class per endpoint, one method per call
    def setUp(self):
        self.root = 'http://localhost'
        self.query_url=self.root + '/ocpu/library/rlines/R/store_csv/';
        header = {
                'content-type': 'multipart/form-data'
                }
        header = {}
        self.csvString = open('counts.csv','r').read()
        files = {'data': self.csvString}
        self.r=requests.post(self.query_url, files=files)
        endpoints = self.r.text.split('\n')
        self.session_id = endpoints[0][10:21]
        #for i in me:
            #req=requests.post('http://localhost' + i)
            #print(i)
            #print(req.text[0:300])
            #print('___')

        #print(r.text)
        self.r.raise_for_status()
    def test_dataloaded(self):
        # Test that data is uploaded from spreadsheet well
        endpoints = self.r.text.split('\n')
        sess = endpoints[0][0:24]
        sess_id = endpoints[0][10:21]
        header = {
                'content-type': 'application/x-www-form-urlencoded'
                }
        r1=requests.get(self.root + endpoints[0] + '/json')
        data = r1.json()
        self.assertEqual(len(data), 3958)
        self.assertEqual(data[14]['X'], 15)
        self.assertEqual(data[17]['region'], 'akroncanton')
    def test_summarizedata(self):
        # Make sure we can run summarize from the base class
        endpoints = self.r.text.split('\n')
        header = {
                'content-type': 'application/x-www-form-urlencoded'
                }
        r4 = requests.post(self.root + '/ocpu/library/base/R/summary',data='object=' + self.session_id + '::.val', headers=header)
        r5 = requests.get(self.root + r4.text.split('\n')[0])
        r5.raise_for_status()



if __name__ == '__main__':
    unittest.main()
