from django.db import models
import datetime
from tempus.helpers import ocpu_wrapper
from tempus.helpers import dict_to_r_args

# Create your models here.k:
class Analysis(models.Model):
# This class stores the set of things
     created_date = models.DateTimeField(auto_now_add=True,
             default=datetime.datetime.now())
class TimeSeriesFile(models.Model):
    analysis = models.ForeignKey('Analysis', null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True,
             default=datetime.datetime.now())
    r_session_id = None # The session id for the loaded variable
    file = models.FileField(upload_to='files/%s' % datetime.datetime.strftime(datetime.datetime.now(),'%s'), blank=True, null=True, max_length=40)

    def load(self):
        """
        Loads csv file into R and stores the pointer to the DF
        """
        files = {'data': self.file.file.read()}
        d = ocpu_wrapper(url='http://localhost/ocpu/library/rlines/R/store_csv/',  files=files)
        d.perform()
        self.r_session_id = d.session_id

