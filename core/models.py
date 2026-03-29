from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    canvas_data = models.JSONField(default=dict) # Stores BuilderState.components
    page_settings = models.JSONField(default=dict) # Stores BuilderState.pageSettings
    preview_image = models.URLField(blank=True, null=True) # Thumbnail URL
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} by {self.user.username}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.user.username
