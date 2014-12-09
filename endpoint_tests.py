import unittest
import requests
import json
import ipdb

class TestGetFeatures(unittest.TestCase):
    # One test class per endpoint, one method per call
    def setUp(self):
        self.query_url='http://localhost/ocpu/library/rlines/R/get_features/json/';
    def test_baltimore(self):
        data = "target.region='nova'&comparison.region.set=c('dc','baltimore')%event.date='2014-01-01'"
        header = {
                'content-type': 'application/x-www-form-urlencoded'
                }
        r=requests.post(self.query_url, data=data, headers=header)
        r.raise_for_status()
        result = r.json()
        self.assertEqual(result[0]['b01001001'],618777)

class TestDiffindiff(unittest.TestCase):
    # One test class per endpoint, one method per call
    def setUp(self):
        self.query_url='http://localhost/ocpu/library/rlines/R/diffindiff/json/';
    def test_level(self):
        data = "target.region='nova'&comparison.region.set=c('dc','baltimore')&event.date='2014-01-01'"
        header = {
                'content-type': 'application/x-www-form-urlencoded'
                }
        r=requests.post(self.query_url, data=data, headers=header)
        r.raise_for_status()
        result = r.json()
        self.assertTrue(result['comparison_diff']['b'][0],6)
        self.assertTrue(result['target_diff']['se'][0],237.1844)
    def test_log(self):
        data = "target.region='nova'&comparison.region.set=c('dc','baltimore')&event.date='2014-01-01'&logged=TRUE"
        header = {
                'content-type': 'application/x-www-form-urlencoded'
                }
        r=requests.post(self.query_url, data=data, headers=header)
        r.raise_for_status()
        result = r.json()
        self.assertTrue(result['comparison_diff']['b'][0],-0.0899)
        self.assertTrue(result['target_diff']['se'][0],0.5986)

class TestWrapper(unittest.TestCase):
    def setUp(self):
        from open import ocpu_wrapper
        header = {}
        self.csvString = open('counts.csv','r').read()
        files = {'data': self.csvString}
        self.api = ocpu_wrapper(url='http://localhost/ocpu/library/rlines/R/store_csv/', header=header, files=files)
        self.api.perform()
    def test_creation(self):
        data = self.api.get_result_object()
        self.assertEqual(len(data),3958)
    def test_sessionid(self):
        self.assertTrue(len(self.api.session_id),12)

if __name__ == '__main__':
    unittest.main()
