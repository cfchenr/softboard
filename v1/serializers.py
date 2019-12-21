from rest_framework import serializers
from .models import *
from rest_framework_simplejwt import serializers as jwt_serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
from django.core.exceptions import ValidationError


class UserTokenSerializer(jwt_serializers.TokenObtainSerializer):
    @classmethod
    def get_token(cls, user):
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        data['id'] = self.user.id
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data


class UserTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh = RefreshToken(attrs['refresh'])
        data = {'access': str(refresh.access_token)}
        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    # Attempt to blacklist the given refresh token
                    refresh.blacklist()
                except AttributeError:
                    # If blacklist app not installed, `blacklist` method will
                    # not be present
                    pass

            refresh.set_jti()
            refresh.set_exp()

            data['refresh'] = str(refresh)

        return data


class UserRegisterSerializer(serializers.ModelSerializer):
    self = serializers.HyperlinkedIdentityField(
        view_name='v1:user_megua_retrieve')
    first_name = serializers.CharField(max_length=50, label='First name')
    last_name = serializers.CharField(max_length=50, label='Last name')
    password = serializers.CharField(write_only=True, required=True, style={
                                     'input_type': 'password'}, label='Password')
    password2 = serializers.CharField(write_only=True, required=True, style={
                                      'input_type': 'password'}, label='Confirm password')
    email = serializers.EmailField(
        write_only=True, required=True, label='Email address')
    email2 = serializers.EmailField(
        write_only=True, required=True, label='Confirm email address')

    class Meta:
        model = MeguaUser
        fields = ['self', 'first_name',
                  'last_name', 'username', 'password', 'password2',
                  'email', 'email2', 'user_type']

    def create(self, validated_data):
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
        username = validated_data['username']
        password = validated_data['password']
        email = validated_data['email']
        user_type = validated_data['user_type']

        user_obj = MeguaUser(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            user_type=user_type
        )

        user_obj.set_password(password)
        user_obj.save()

        return user_obj

    def validate_password2(self, value):
        data = self.get_initial()
        password1 = data.get('password')
        password2 = value
        if password1 != password2:
            raise ValidationError("Passwords must match")
        return value

    def validate_email2(self, value):
        data = self.get_initial()
        email1 = data.get('email')
        email2 = value
        if email1 != email2:
            raise ValidationError("Emails must match")
        return value


class UserListSerializer(serializers.ModelSerializer):
    self = serializers.HyperlinkedIdentityField(
        view_name='v1:user_megua_retrieve')
    username = serializers.CharField(max_length=50, read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(max_length=50, label='First name')
    last_name = serializers.CharField(max_length=50, label='Last name')
    user_type = serializers.CharField(
        max_length=100, read_only=True, label="User type")

    class Meta:
        model = MeguaUser
        fields = ['self', 'username', 'first_name',
                  'last_name', 'email', 'user_type']


class UserRetrieveSerializer(serializers.ModelSerializer):
    self = serializers.HyperlinkedIdentityField(
        view_name='v1:user_megua_retrieve')
    username = serializers.CharField(max_length=50, read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(max_length=50, label='First name')
    last_name = serializers.CharField(max_length=50, label='Last name')
    user_type = serializers.CharField(
        max_length=100, read_only=True, label="User type")

    class Meta:
        model = MeguaUser
        fields = ['self', 'username', 'first_name',
                  'last_name', 'email', 'user_type']


class ExerciseSerializer(serializers.ModelSerializer):
    ExerciseId = serializers.CharField(max_length=150000, read_only=True)
    created_by = serializers.HyperlinkedRelatedField(
        view_name='v1:user_megua_retrieve', read_only='True')
    modified_by = serializers.HyperlinkedRelatedField(
        view_name='v1:user_megua_retrieve', read_only='True')

    class Meta:
        model = Exercise
        fields = "__all__"


class ExerciseDashboardSerializer(serializers.ModelSerializer):
    ExerciseId = serializers.CharField(max_length=150000, read_only=True)
    created_by = serializers.HyperlinkedRelatedField(
        view_name='v1:user_megua_retrieve', read_only='True')
    modified_by = serializers.HyperlinkedRelatedField(
        view_name='v1:user_megua_retrieve', read_only='True')

    class Meta:
        model = Exercise
        fields = "__all__"


class SubheadingSerializer(serializers.ModelSerializer):
    created_by = serializers.HyperlinkedRelatedField(
        view_name='v1:user_megua_retrieve', read_only='True')
    updated_by = serializers.HyperlinkedRelatedField(
        view_name='v1:user_megua_retrieve', read_only='True')

    class Meta:
        model = Subheading
        fields = ['Exercise', 'Order', 'Question', 'Tags', 'Suggestion',
                  'Solution', 'created_by', 'create_dt', 'updated_by', 'update_dt']


class ExerciseFileSerializer(serializers.ModelSerializer):
    last_modification = serializers.CharField(
        max_length=150000, read_only=True)
    created_by = serializers.HyperlinkedRelatedField(
        view_name='v1:user_megua_retrieve', read_only='True')
    updated_by = serializers.HyperlinkedRelatedField(
        view_name='v1:user_megua_retrieve', read_only='True')

    class Meta:
        model = ExerciseFile
        fields = "__all__"
