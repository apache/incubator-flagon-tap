from django.apps import AppConfig

class AppMgrConfig(AppConfig):
    name = 'app_mgr'
    verbose_name = "Application Manager"

    def ready(self):
        print 'Loading', self.verbose_name
        import app_mgr.signals.handlers
