require 'sinatra'

set :root, File.dirname(__FILE__)
set :public_folder, Proc.new { File.join(root, "public") }

get '/' do
  erb :index, :layout => :layout
end

get '/game' do
  @level = params[:level]
  erb :game, :layout => :layout
end
