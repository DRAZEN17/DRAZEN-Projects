from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer

# Create your views here.

@api_view(['POST'])
def login(request):
    user = authenticate(
        username=request.data['username'],
        password=request.data['password']
    )

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'email': user.email
        })

    return Response({'error': 'Invalid credentials'})


@api_view(['POST'])
def signup(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'message': 'User created successfully'
        })

    return Response(serializer.errors)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Book
from .serializers import BookSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_books(request):
    books = Book.objects.filter(user=request.user)
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_book(request):
    serializer = BookSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response({'message': 'Book added'})

    return Response(serializer.errors)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_book(request, id):
    try:
        book = Book.objects.get(id=id, user=request.user)
    except Book.DoesNotExist:
        return Response({'error': 'Not found'})

    serializer = BookSerializer(book, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Updated'})

    return Response(serializer.errors)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_book(request, id):
    try:
        book = Book.objects.get(id=id, user=request.user)
        book.delete()
        return Response({'message': 'Deleted'})
    except Book.DoesNotExist:
        return Response({'error': 'Not found'})