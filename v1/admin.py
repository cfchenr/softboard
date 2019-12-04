from django.contrib import admin
from v1.models import *

# Register your models here.
@admin.register(MeguaUser)
class MeguaUserAdmin(admin.ModelAdmin):
    pass

@admin.register(ExerciseFile)
class ExerciseFileAdmin(admin.ModelAdmin):
    pass

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    pass

@admin.register(Subheading)
class SubheadingAdmin(admin.ModelAdmin):
    pass