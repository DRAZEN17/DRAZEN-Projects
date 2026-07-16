from django.shortcuts import render
from django.http import JsonResponse
import requests

def index(request):
    return render(request, 'weather/index.html')

def get_weather(request):
    city = request.GET.get('city')
    api_key = 'fe411af067790ab938455a0095476f55'
    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    response = requests.get(url).json()
    data = {
        'city': city,
        'temp': response['main']['temp'],
        'description': response['weather'][0]['description']
    }
    return JsonResponse(data)