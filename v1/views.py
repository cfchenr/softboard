from django.shortcuts import render
from rest_framework import viewsets, views
from rest_framework.permissions import *
from .serializers import *
from .models import *
from rest_framework_simplejwt import views as jwt_views
from rest_framework.pagination import PageNumberPagination
from django.urls import reverse
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404, get_list_or_404


# Create your views here.
class UserTokenView(jwt_views.TokenViewBase):
    serializer_class = UserTokenSerializer


class UserTokenRefreshView(jwt_views.TokenViewBase):
    serializer_class = UserTokenRefreshSerializer


class UserRegisterView(views.APIView):
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        # Get data from post
        data = request.data

        # Create seriralizer with data
        serializer = UserRegisterSerializer(
            data=data, context={'request': request})

        # Verify if serializer is valid
        if serializer.is_valid(raise_exception=True):

            # Save serializer with read_only fields
            serializer.save()
            new_data = serializer.data

            # Return serializer with all fields
            return_data = {
                'login': request.build_absolute_uri(reverse('v1:token_obtain_pair')),
                'results': [new_data]
            }
            return Response(return_data, status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors)


class UserListView(views.APIView):
    serializer_class = UserListSerializer

    def get(self, request):
        # try get logged user
        try:
            user = MeguaUser.objects.get(pk=request.user.id)
        except Exception as e:
            # TODO: Change error message
            return Response({'Error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        if user.is_superuser:
            queryset = MeguaUser.objects.all()
        else:
            queryset = MeguaUser.objects.filter(pk=user.id)
        user = get_list_or_404(queryset)

        # Get serializer and pagination
        paginator = PageNumberPagination()
        results = paginator.paginate_queryset(user, request)
        serializer = UserListSerializer(
            results, context={'request': request}, many=True)

        # Return the serializer
        return paginator.get_paginated_response(serializer.data)


class UserRetrieveView(views.APIView):
    serializer_class = UserRetrieveSerializer

    def get(self, request, pk=None):
        # try get logged user
        try:
            user = MeguaUser.objects.get(pk=self.request.user.id)
        except Exception as e:
            # TODO: Change error message
            return Response({'Error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        # Get instance of pk
        queryset = MeguaUser.objects.all()
        account = get_object_or_404(queryset, pk=pk)

        if account.id == user.id:

            # Get serializer from the instance
            serializer = UserRetrieveSerializer(
                account, context={'request': request})

            # Return the serializer
            return Response(serializer.data)

        else:
            return Response({'Error': 'You don´t have permission for this action.'}, status=status.HTTP_401_UNAUTHORIZED)


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]
