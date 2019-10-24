from django.db import models
from django.contrib.auth.models import AbstractUser
import os
from django.conf import settings

# Create your models here.


class MeguaUser(AbstractUser):
    STUDENT = 'ST'
    PROFESSOR = 'PROF'
    USER_TYPE_CHOICES = [
        (STUDENT, 'Student'),
        (PROFESSOR, 'Professor'),
    ]
    pass
    username = models.CharField(max_length=150, unique=True)
    user_type = models.CharField(
        choices=USER_TYPE_CHOICES, default=STUDENT, max_length=100)
    create_dt = models.DateTimeField(auto_now_add=True)
    update_dt = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.first_name + " " + self.last_name


class Exercise(models.Model):
    ExerciseId = models.CharField(max_length=150000, blank=False, null=False)
    Title = models.CharField(max_length=100, blank=False, null=False)
    Problem = models.TextField(max_length=150000, blank=False, null=False)
    Resolution = models.TextField(max_length=150000, blank=True, null=True)
    created_by = models.ForeignKey(
        MeguaUser, on_delete=models.DO_NOTHING, related_name="ExerciseCreatedBy")
    create_dt = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(MeguaUser, blank=True, null=True,
                                   on_delete=models.DO_NOTHING, related_name="ExerciseUpdatedBy")
    update_dt = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.Title


class Subheading(models.Model):
    Exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    Order = models.CharField(max_length=25, blank=False, null=False)
    Question = models.CharField(max_length=100, blank=False, null=False)
    Tags = models.CharField(max_length=250, blank=True, null=True)
    Sugestion = models.CharField(max_length=2000, blank=True, null=True)
    Solution = models.CharField(max_length=2000, blank=True, null=True)
    created_by = models.ForeignKey(
        MeguaUser, on_delete=models.DO_NOTHING, related_name="SubheadingCreatedBy")
    create_dt = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(MeguaUser, blank=True, null=True,
                                   on_delete=models.DO_NOTHING, related_name="SubheadingUpdatedBy")
    update_dt = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.Exercise + " - " + self.Order + ")" + self.Question


class ExerciseFile(models.Model):
    File = models.FileField(blank=False, null=False)
    last_modification = models.CharField(
        max_length=150000, blank=False, null=False)
    created_by = models.ForeignKey(
        MeguaUser, on_delete=models.DO_NOTHING, related_name="ExerciseFileCreatedBy")
    create_dt = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(MeguaUser, blank=True, null=True,
                                   on_delete=models.DO_NOTHING, related_name="ExerciseFileUpdatedBy")
    update_dt = models.DateTimeField(auto_now=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        initial_path = self.File.path

        new_path = os.path.join(settings.MEDIA_ROOT, self.created_by.username,
                                "Exercises", self.File.name)

        if not os.path.exists(os.path.dirname(new_path)):
            os.makedirs(os.path.dirname(new_path))

        if os.path.exists(new_path):
            os.remove(new_path)

        super(ExerciseFile, self).save(*args, **kwargs)

        os.rename(self.File.path, new_path)
