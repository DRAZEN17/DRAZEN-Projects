import random
from django.shortcuts import render,redirect,get_object_or_404
from django .contrib.auth import login,authenticate,logout
from .forms import signupForm, LoginForm
from django.contrib import messages
from .models import Category, Blog
from django.core.paginator import Paginator

# Create your views here.
# Auth
def signup_views(request):

    if request.method == 'POST':
        form = signupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Account created sucessfully")
            return redirect(home_page)
        else:
            messages.error(request, "password must be more than 8 or username already exist")
    else:
        form = signupForm()

    return render(request, 'sign_up.html',{'form': form})


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, passsword=password)

        if user is not None:
            login(request, user)
            messages.success(request, "Welcome back! 😁")
            return redirect('home_page')
        else:
            messages.error(request, "Invaild username or password ❌")
            return redirect('login')

    return render(request, 'login.html')



def home_page(request):
    blogs = Blog.objects.all().order_by('-date_published')
    categories = Category.objects.all()
    return render(request, "blog.html", {
        'blogs' : blogs,
        'categories' : categories
    })

def about(request):

    
    return render(request, "about.html")

def categories(request):
    blogs = Blog.objects.all().order_by('-date_published')
    categories = Category.objects.all()
    return render(request, "categories.html", {
        'blogs' : blogs,
        'categories' : categories
    })

def contact(request):

    
    return render(request, "contact_us.html")

def explore(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    blogs = Blog.objects.filter(Category=category).order_by('-date_published')
    categories = Category.objects.all()

    paginator = Paginator(blogs, 1)
    page_number = request.GET .get('page')

    blogs = paginator.get_page(page_number)
    return render(request, "explore.html" , {
        'blogs': blogs,
        'category': category,
        'categories': categories
    })


def single(request, pk):
    blog = get_object_or_404(Blog, pk= pk)
    categories = Category.objects.all()
    
    all_blog = list(Blog.objects.exclude(pk=pk))
    random.shuffle(all_blog)
    blogs = all_blog[:3]
    return render(request, "single_page.html", {
        'blog' : blog,
        'blogs': blogs,
        'categories': categories
    })
