---
title: "Sending mails with sidekiq & cron jobs in Ruby on Rails"
description: A guide on how to create emails with ActionMailer and automatically sending them on a fixed schedule using sidekiq and cron jobs. 
coverImage: cover-image-sending-mails-with-sidekiq-cron-jobs-in-ruby-on-rails.jpeg
alt: cover-image-sending-mails-with-sidekiq-cron-jobs-in-ruby-on-rails
createdAt: 2021-02-23
---

##### 💡 Demo

The code we'll be referring to during this article is from the [daily catfact](https://daily-catfact.herokuapp.com/) project. This project uses a cron job to send out a catfact everyday to all the subscribers.

##### ⚙️ Code

The example project's code can be found in this repository on Github: [woetflow-demo-catfacts-mailer](https://github.com/WoetDev/woetflow-demo-catfacts-mailer)

Since we're gonna be talking about some specific features in Rails I'll assume you're already familiar with setting up a project so I'll skip over that. In this post we're using a Rails 6 project which uses rspec as a testing framework.

-------
<br>

## 1. Setting up the email templates

### 1.1 Creating the mailers

To start setting up our email templates, we'll run a generator to create the mailer.

Run: ```rails g mailer catfact_mailer```

We'll also change the default email address from which our mails are being sent as well as add a name so our recipients will see they've received a mail from 'Woet' instead of 'wouter.bruynsteen@gmail.com".

```app/mailers/application_mailer.rb:```

```ruby
class ApplicationMailer < ActionMailer::Base
  default from: 'Woet <wouter.bruynsteen@gmail.com>'
  layout 'mailer'
end
```

With the general mailer settings configured, we'll also define our specific mailer method that will be sending out the daily catfact. In the context of mailers we can also refer to these methods as 'actions'.

```app/mailers/catfact_mailer.rb:```

```ruby
class CatfactMailer < ApplicationMailer
  def daily_catfact
    @user = params[:user]
    @fact = params[:fact]
    mail(to: @user.email, subject: "Daily catfact! ##{Fact.count}")
  end
end
```

In this action we've assigned the user and fact instance variables which we'll receive from the params hash. We're then calling the mail method, which will generate the actual message. In this method we'll set the email headers for the main recipient and subject.

With the mailer set-up, let's go create our templates.

### 1.2 Creating the templates

Not all clients prefer HTML emails or might even have it disabled, so it's a best practice to always create both an HTML and plain text version of the email.

```app/views/catfact_mailer.html.erb:```

```html
<body>
  <h1>Your daily catfact is here! 😺</h1>
  <h3>
    DID YOU KNOW?
  </h3>
  <p>
    <%= @fact %> 🐈
  </p>
  <br>
  <br>
  <br>
  <hr>
  <p>
    <%= link_to "Unsubscribe", unsubscribe_url(email: @user.email), target: "_blank" %>
  </p>
</body>
```

```app/views/catfact_mailer.text.erb:```

```plaintext
Your daily catfact is here! 😺
===============================================

DID YOU KNOW?

<%= @fact %> 🐈

===============================================
You can visit the following URL to unsubscribe: <%= unsubscribe_url(email: @user.email) %>
```

In the templates we're also generating an unsubscribe_url, in order for this to work correctly we'll need to set the :host parameter ourselves since unlike controllers, the mailer instance doesn't have any context about the incoming request.

```config/environments/development.rb:```

```ruby
# Domain for mailer urls
  config.action_mailer.default_url_options = { host: 'localhost:3000' }
```

```config/environments/production.rb:```

```ruby
# Domain for mailer urls
  config.action_mailer.default_url_options = { host: 'daily-catfact.herokuapp.com' }
```

When you call the mail method now, Action Mailer will detect the two templates (text and HTML) and automatically generate a multipart/alternative email.

### 1.3 Generating previews

Now, the only way we'd be able to check out how our email templates are looking is by actually sending the email. If you need even just a few iterations to get your emails looking the way you want, you can see how this can get rather tedious.

Luckily, Action Mailer also provides an easy way for us to generate previews in our development environment.

In this project I'm using rspec as the testing framework but besides the path of where the previews are generated, everything is the same as using minitest. You can also [refer to the Ruby on Rails guide](https://guides.rubyonrails.org/action_mailer_basics.html#previewing-emails) to read more about the previews with minitest.

```spec/mailers/previews/catfact_mailer_preview.rb:```

```ruby
# Preview all emails at <http://localhost:3000/rails/mailers/catfact_mailer>
class CatfactMailerPreview < ActionMailer::Preview
  def daily_catfact
    CatfactMailer.with(user: User.all.sample, fact: CatfactServices::Catfact.new.daily_fact).daily_catfact
  end
end
```

In the ```daily_catfact``` method we're calling our ```catfact_mailer``` and any key-value pair passed to with just becomes the params for the mailer action. So ```with(user: User.all.sample, fact: CatfactServices::Catfact.new.daily_fact)``` makes ```params[:user]``` with a random user and ```params[:fact]``` with the daily catfact available in the mailer action.

## 2. Configuring sidekiq

### 2.1 Add sidekiq as the queueing adapter

To send out the emails about the daily catfact, we'll be processing them in a background job where sidekiq will act as the queueing adapter for our application.

Sidekiq uses redis to store all the operational data so if this your first time using redis, you'll still need to install redis-server. The install process differs depending on your machine (Mac, Linux, etc.). You should be able to find the installation online as this has been documented plenty.

Once installed, you can make sure redis-server is running correctly by restarting it.

Run: ```sudo service redis-server restart```

Now that redis is running, let's start configuring sidekiq.

```Gemfile:```

```ruby
gem "sidekiq"
```

Run: ```bundle install```

Then to tell our application we're using sidekiq we'll add that to our configuration.

```config/application.rb:```

```ruby
config.active_job.queue_adapter = :sidekiq
```

### 2.2 Configuring sidekiq

Now let's add an initializer which can be used to configure sidekiq to interact with our redis queue.

Run: ```touch config/initializers/sidekiq.rb```

Add the following to ```sidekiq.rb```

```ruby
Sidekiq.configure_client do |config|
  config.redis = { url: ENV['REDIS_URL'], size: 4, network_timeout: 5 }
end

Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'], size: 4, network_timeout: 5 }
end
```

Here the client is our passenger, which is puma running behind rails, and can be literally termed as anything that pushes jobs to Redis. The server is the sidekiq process which pulls jobs from Redis. That means when deploying, our web dynos in Heroku will use a max of size number of connections to push jobs to Redis, no matter how many threads they have.

The initializer is meant for more complicated config which requires Ruby, for instance the Redis connection info or custom middleware. Now let's add a config/sidekiq.yml, which is meant to be a persistent config for all options we can pass to sidekiq.

```touch config/sidekiq.yml```

Add the following to that file:

```yml
development:
  :concurrency: 1
production:
  :concurrency: 1
:queues:
  - default
```

We can change concurrency based on our needs. Currently in this project we only need to send out the emails once a day so we won't have multiples of this job running at the same time. Also note that, default is just the name of our queue.

### 2.3 Booting up sidekiq

One more thing we need to find before running sidekiq is knowing what our redis url is.

To do that, we'll go to rails console.

Run: ```rails c```

Once the console is booted, you can run ```Sidekiq.redis {|c| c.inspect}``` which should print out something similar to ```"#<Redis client v4.2.5 for redis://127.0.0.1:6379/0>"``` . The ```redis://127.0.0.1:6379/0``` part is the redis url we need.

With this information, we can already boot up sidekiq.

Note that you need to run sidekiq in another terminal (tab) than your Rails server.

Run: ```REDIS_URL="redis://127.0.0.1:6379/0" bundle exec sidekiq -e development -C config/sidekiq.yml```

This command is quite a mouthful, so to avoid having to add the ```REDIS_URL``` in the command every time, we'll add it as a global environment variable.

Run: ```echo 'export REDIS_URL="redis://127.0.0.1:6379/0"' >> ~/.bashrc```

Then export the variable for current session

Run: ```source ~/.bashrc```

And we're set!

Now we should be able to boot up sidekiq by simply running: ```sidekiq```

### 2.4 Enabling the sidekiq web UI

Sidekiq also offers a very useful web UI out-of-the-box where we can find all information about our background jobs and also choose to manually run them from there.

All we need to do to enable the web UI is require this in our routes file.

```config/routes.rb:```

```ruby
require 'sidekiq/web'

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq'
end
```

Make sure it's mounted within the draw block so it can reuse the same Rails session.

Now when you boot up the server with rails s, you can navigate to localhost:3000/sidekiq to access the web UI.

## 3. Configuring the cron job

Now that we have sidekiq set-up, let's go and create the actual background job that will send out the emails for the daily catfact and run this on a fixed schedule using a cron job.

### 3.1 Creating the background job

We can create our job with a rails generator.

Run: ```rails g job catfact_mailer```

Once generated, all we need to do is complete the perform method.

```app/jobs/catfact_mailer_job.rb:```

```ruby
class CatfactMailerJob < ApplicationJob
  queue_as :default

  def perform(*args)
    User.find_each do |user|
      CatfactMailer.with(user: user, fact: CatfactServices::Catfact.new.daily_fact).daily_catfact.deliver_now
    end
  end
end
```

When calling this background job, we'll add it to the default queue and then find each user in database to send them the daily catfact. Notice that since we're calling it directly from the background job we're sending the email by using the ```deliver_now``` method.

Since ```deliver_now``` is synchronous, if we'd be sending the mail from for example a controller method we should always use ```deliver_later``` to avoid making our user wait for the mail server to respond.

### 3.2 Configuring the cron job

Since sidekiq only offers cron jobs with their 'Enterprise' license, we'll be using the third-party gem [sidekiq-cron](https://github.com/ondrejbartas/sidekiq-cron) to configure our cron job.

```Gemfile:```

```ruby
gem 'sidekiq-cron'
```

Run: ```bundle install```

We could include our cron job directly in the ```catfact_mailer_job.rb``` file, but to keep it clean I prefer adding the cron job inside a separate YAML file so we can use this as the crontab file.

Run: ```touch config/schedule.yml```

Once created, add the following code inside this file:

```yml
catfact_mailer_job:
  cron: "5 7 * * *"
  class: "CatfactMailerJob"
  queue: default
```

This file creates a cron job called ```catfact_mailer_job```, the cronline ```5 7 * * *``` states that the cron job should run the ```CatfactMailerJob``` everyday at 7:05 AM and place it on the default queue.

To test out the cronline, a good resource is [crontab.guru](https://crontab.guru).

After this set-up, you should now have a fully functional & automated catfact mailer! Of course, we'd want to also share all this wonderful cat knowledge with the rest of the world so in order to do that we'll need to deploy it to production.

The sidekiq-cron gem also comes with an extension to sidekiq web UI. To enable it, we only need to require it in our routes file.

```config/routes.rb:```

```ruby
require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq'
end
```

Now we can navigate to a 'cron' tab in the sidekiq web UI on ```localhost:3000/sidekiq/cron``` where we can review & manually enqueue our cron jobs.

## 4. Deploying to production

To deploy the application, we'll be using Heroku as the hosting service.

So if you haven't yet, [sign up for a Heroku account](https://heroku.com/) and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

You'll also need to create a new git repository and push your changes, I'm using [Github](https://github.com/) for my repositories.

I'll assume you're already familiar with these services or something similar mentioned above, but if not, then there are plenty of guides online that will take you step-by-step to get this installed for your system.

But without further ado, let's get into the specifics for our application.

### 4.1 SMTP settings to send email in production

To enable sending email in production we'll use the [Amazon Simple Email Service](https://aws.amazon.com/ses/).

[This guide on Hixonrails](https://hixonrails.com/ruby-on-rails-tutorials/ruby-on-rails-action-mailer-configuration#ruby-on-rails-action-mailer-amazon-ses-configuration) will take you through every step needed to get everything configured in Amazon SES and in your Rails application.

The only thing I'll add to this guide is how to set the environment variables in development and production.

To set the environment variables in development, I'm using the figaro gem.

Figaro makes it easy to manage your environment variables using an application.yml file and you can access them with for example ```ENV['SMTP_ADDRESS']```.

```Gemfile:```

```ruby
gem 'figaro'
```


Run: ```bundle install```

Run: ```bundle exec figaro install```

This creates a commented config/application.yml file and adds it to your .gitignore. All we need to do now is add our environment variables in there.

```config/application.yml:```

```yml
SMTP_ADDRESS: "<your-ses-address>"
SMTP_USER_NAME: "<your-ses-user-name>"
SMTP_PASSWORD: "<your-ses-password>"
```

We also need to set these same environment variables on Heroku, but with the Heroku CLI this is an even easier process.

To set the environment variables, run: ```heroku config:set SMTP_ADDRESS=<your-ses-address> SMTP_USERNAME=<your-ses-user-name> SMTP_PASSWORD=<your-ses-password>```

To check if these environment variables are correctly set on Heroku, we can run: ```heroku config```

### 4.2 Provision Redis and create a Procfile

Because we have an application that uses background jobs, we'll need a dyno to run our application on as well as a worker dyno for the background jobs. To tell Heroku how to run these dynos, we'll create a Procfile and provision Redis to run the background jobs.

#### 4.2.1 Provision Redis

To provision Redis we simply need to run one command with the Heroku CLI.

Run: ```heroku addons:create redistogo:nano --app your-app-name```

#### 4.2.2 Create a Procfile

Run: ```touch Procfile```

Inside this Procfile we need to define our commands in the following structure:

```
<process type>: <command>
```

```<process type>``` is an alphanumeric name for your command, such as web, worker, urgentworker, clock, and so on.

```<command>``` indicates the command that every dyno of the process type should execute on startup, such as rake jobs:work.

So for our application we need to define both a web and worker process for our application and background jobs.

```Procfile:```

```yml
web: bin/rails server -p ${PORT:-5000} -e $RAILS_ENV
worker: bundle exec sidekiq
```

After pushing your latest changes to your resposity and deploying them on Heroku, we can test if the Procfile is working correctly.

Run: ```heroku ps --app your-app-name```

If everything is working correctly, you should see something similar to the following ouput:

```
Free dyno hours quota remaining this month: 874h 30m (87%)
Free dyno usage for this app: 41h 0m (4%)
For more information on dyno sleeping and how to upgrade, see:
<https://devcenter.heroku.com/articles/dyno-sleeping>

=== web (Free): bin/rails server -p ${PORT:-5000} -e $RAILS_ENV (1)
web.1: up 2021/02/25 19:51:01 +0100 (~ 11m ago)

=== worker (Free): bundle exec sidekiq (1)
worker.1: up 2021/02/25 19:50:43 +0100 (~ 12m ago)
```

### 4.3 Making it work on free dynos

With a Procfile added, Heroku runs the dynos we need. However, the problem is that If we're running on free dynos, then Heroku will put both the web AND the worker dyno to sleep automatically after 30 minutes of inactivity.

Since our cron job is running on the worker dyno, if there is no activity at most 30 minutes before our cron job is scheduled to run, it won't run at all and the daily catfact mail won't be sent out! 🙀

To solve that, we'll need to use the Heroku Scheduler addon to run a command that will wake up the dynos shortly before our cron job is scheduled to run, the Heroku Scheduler runs on a one-off dyno so the execution of this command is not dependent on our web or worker dyno.

We'll start by adding the Heroku Scheduler to our app.

Run: ```heroku addons:create scheduler:standard --app your-app-name```

Once added, we'll open up the addon in the web browser.

Run: ```heroku addons:open scheduler --app your-app-name```

In the web browser, click 'Add Job' and then let the command ```curl https://your-app-domain``` run everyday at 7:00 AM UTC. Here we're using the ```curl``` command to simply read our webpage, but this is all we need to do in order to ping the server and wake up our dynos.

You might've noticed that the Heroku Scheduler always uses UTC, by default the Rails app will use your local (i.e. system) time. So we'll also add a configuration to our Rails app to ensure it's running on the UTC±00:00 timezone so there's no timezone confusion between the Heroku Scheduler and our cron job.

```config/application.rb:```

```ruby
class Application < Rails::Application
  config.time_zone = "UTC"
  config.active_record.default_timezone = :utc
end
```

So to recap; the Heroku Scheduler will run ```curl https://your-app-domain``` at 7:00 AM UTC, which will wake up our web and worker dynos for at least 30 minutes. That will ensure that our cron job will run on the worker dyno at 7:05 AM UTC and send out our daily catfact!

Now all we need to do is make sure our latest changes are deployed to production and we're done!