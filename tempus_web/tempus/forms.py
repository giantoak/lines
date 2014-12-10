from django import forms
from tempus.models import TimeSeriesFile

class TimeSeriesFileForm(forms.ModelForm):
    class Meta:
        model=TimeSeriesFile
