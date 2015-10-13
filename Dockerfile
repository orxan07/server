FROM alpine:latest
MAINTAINER orxan@rehimli.info

# If docker image from ubuntu : {
#RUN
#RUN apt-get update
#RUN apt-get install -y nodejs nodejs-legacy npm
#RUN apt-get clean              }

RUN apk add --update nodejs=0.12.2-r0 git python make && \
    rm -rf /var/cache/apk/* && \
    npm install -g npm
    
COPY ./package.json src/

RUN cd src && npm install

COPY . /src

WORKDIR src/

CMD ["npm","start"]
