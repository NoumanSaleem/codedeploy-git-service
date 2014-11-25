FROM dockerfile/nodejs
EXPOSE 3000

RUN apt-get update
RUN apt-get install -y curl

RUN curl https://bootstrap.pypa.io/get-pip.py > /tmp/get-pip.py
RUN python /tmp/get-pip.py
RUN pip install awscli

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app
RUN chmod +x create-deployment

ENV PORT 3000

CMD npm start
