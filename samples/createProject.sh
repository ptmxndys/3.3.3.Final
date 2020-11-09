#!/bin/sh
mvn archetype:create -DarchetypeGroupId=org.richfaces.cdk -DarchetypeArtifactId=maven-archetype-jsfwebapp \
         -DarchetypeVersion=3.3.3.Final -Dversion=3.3.3.Final -DgroupId=org.richfaces.samples -DartifactId=$1
