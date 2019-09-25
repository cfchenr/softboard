from django.db import models
from django.contrib.auth.models import AbstractUser 

# Create your models here.
class MeguaUser(AbstractUser):
    STUDENT             = 'ST'
    PROFESSOR           = 'PROF'
    USER_TYPE_CHOICES   = [
        (STUDENT, 'Student'),
        (PROFESSOR, 'Professor'),
    ]
    pass
    username            = models.CharField(max_length = 150, unique = True)
    user_type           = models.CharField(choices = USER_TYPE_CHOICES, default = STUDENT, max_length=100)
    create_dt           = models.DateTimeField(auto_now_add=True)
    update_dt           = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.first_name + " " + self.last_name

class Exercise(models.Model):
    Tittle              = models.CharField(max_length=100, blank=False, null=False)
    Problem             = models.TextField(max_length=150000, blank=False, null=False)
    Answer              = models.TextField(max_length=150000, blank=False, null=False)
    created_by          = models.ForeignKey(MeguaUser, on_delete=models.DO_NOTHING, related_name="ExerciseCreatedBy")
    create_dt           = models.DateTimeField(auto_now_add=True)
    updated_by          = models.ForeignKey(MeguaUser, blank=True, null=True, on_delete=models.DO_NOTHING, related_name="ExerciseUpdatedBy")
    update_dt           = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.Tittle