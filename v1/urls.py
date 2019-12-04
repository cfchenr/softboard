from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('exercise', views.ExerciseViewSet)
router.register('exerciseDashboard', views.ExerciseDashboardViewSet)
router.register('subheading', views.SubheadingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', views.UserTokenView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.UserTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.UserRegisterView.as_view(),
         name='user_megua_register'),
    path('user/', views.UserListView.as_view(), name='user_megua_list'),
    path('user/<pk>/', views.UserRetrieveView.as_view(),
         name='user_megua_retrieve'),
    path('uploadExercises/', views.UploadExercises.as_view(), name='upload_exercises')
]
