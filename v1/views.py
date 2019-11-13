import yaml
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
from rest_framework.parsers import MultiPartParser, FormParser
import re
import os
from django.conf import settings
from rest_framework import filters

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
    filter_backends = [filters.SearchFilter]
    search_fields = ['Title', 'Problem', 'subheading__Tags']


class SubheadingViewSet(viewsets.ViewSet):
    queryset = Subheading.objects.all()
    serializer_class = SubheadingSerializer

    def retrieve(self, request, pk=None):
        exercise = Exercise.objects.get(pk=pk)
        queryset = Subheading.objects.filter(Exercise=exercise.id)
        subheadings = get_list_or_404(queryset)

        # Get serializer and pagination
        paginator = PageNumberPagination()
        results = paginator.paginate_queryset(subheadings, request)
        serializer = SubheadingSerializer(
            results, context={'request': request}, many=True)

        # Return the serializer
        return paginator.get_paginated_response(serializer.data)


class UploadExercises(views.APIView):
    parser_classes = (MultiPartParser, FormParser,)
    serializer_class = ExerciseFileSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = MeguaUser.objects.get(pk=self.request.user.id)
        # TODO: VERIFICAR SE O USER É PROF
        if user.user_type == 'PROF':
            return Response("error")

        data = request.data

        # TODO: VERIFICAR SE O EXERCICIO (FILE) JÁ EXISTE
        # TODO: CASO EXISTA VERIFICAR SE É DO UTILIZADOR
        # TODO: CASO EXISTA, CRIAR O EXERCISEFILESERIALIZER COM A INSTANCIA

        fileExists = False
        try:
            queryset = ExerciseFile.objects.filter(
                File=str(data["File"]))
            file = get_object_or_404(queryset)
            if file.created_by.id != user.id:
                return Response("error2")
            serializer = ExerciseFileSerializer(
                file, data=data, context={'request': request}, partial=True)
            fileExists = True
        except Exception as e:
            serializer = ExerciseFileSerializer(
                data=data, context={'request': request})

        if serializer.is_valid(raise_exception=True):
            serializer.save(created_by=user)

            with open(os.path.join(settings.MEDIA_ROOT, user.username,
                                   "Exercises", serializer.data["File"].split("/")[-1]), 'r', encoding="utf8") as stream:
                data_loaded = yaml.safe_load(stream)

                # TODO: SE O EXERCICIO(FILE) EXISTIR, FAZER UPDATE AO EXERCICIO
                resolution = ''
                if "resolution" in data_loaded:
                    resolution = data_loaded["resolution"]
                if fileExists:
                    exercise = ExerciseSerializer(Exercise.objects.get(ExerciseId=user.username + "_" + serializer.data["File"].split("/")[-1].split(".")[0]), data={
                                                  "Problem": data_loaded["problem"], "Resolution": resolution, "Title": data_loaded["title"]}, context={'request': request}, partial=True)
                else:
                    exercise = ExerciseSerializer(
                        data={"Problem": data_loaded["problem"], "Resolution": resolution, "Title": data_loaded["title"]}, context={'request': request})

                #TODO: KLASSIFY

                if exercise.is_valid(raise_exception=True):
                    if fileExists:
                        instance = exercise.save(updated_by=user)
                    else:
                        instance = exercise.save(
                            created_by=user, ExerciseId=user.username + "_" + serializer.data["File"].split("/")[-1].split(".")[0])

                    r = re.compile("question-*")
                    questions = list(filter(r.match, data_loaded))

                    for question in questions:
                        data = {}
                        order = question.split("-")[1]
                        data["Order"] = order
                        data["Question"] = data_loaded["question-"+order]
                        if "tags-"+order in data_loaded:
                            data["Tags"] = str(data_loaded["tags-"+order])
                        if "suggestion-"+order in data_loaded:
                            data["Suggestion"] = data_loaded["suggestion-"+order]
                        if "solution-"+order in data_loaded:
                            data["Solution"] = data_loaded["solution-"+order]

                        if fileExists:
                            try:
                                queryset = Subheading.objects.filter(
                                    Exercise=instance, Order=order)
                                subheading_instance = get_object_or_404(
                                    queryset)
                                subheading = SubheadingSerializer(subheading_instance,
                                                                  data=data, context={'request': request})
                                if subheading.is_valid(raise_exception=True):
                                    subheading.save(
                                        updated_by=user)
                            except Exception as e:
                                print(e)
                                # TODO: CASO O EXERCICIO EXISTA, FAZER UPDATE A ALINEA, CASO NÃO SEJA NOVA
                                # TODO: VERIFICAR SE ESTAO NA BD A MAIS
                                subheading = SubheadingSerializer(
                                    data=data, context={'request': request})
                                if subheading.is_valid(raise_exception=True):
                                    subheading.save(
                                        created_by=user, Exercise=instance)
                        else:
                            subheading = SubheadingSerializer(
                                data=data, context={'request': request})
                            if subheading.is_valid(raise_exception=True):
                                subheading.save(
                                    created_by=user, Exercise=instance)

                    return Response(exercise.data)

                return Response(exercise.errors)

        return Response(serializer.errors)
