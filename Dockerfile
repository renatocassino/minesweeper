FROM ruby:2.2.1
MAINTAINER Renato Cassino <renatocassino@gmail.com>

RUN /bin/sh -c "apt-get update"

# Install gems
ENV APP_HOME /app
ENV HOME /root
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
COPY Gemfile* $APP_HOME/

RUN bundle install

# Upload source
COPY . $APP_HOME

# Start server
ENV PORT 3000
EXPOSE 3000
CMD ["ruby", "app.rb"]
