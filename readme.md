打包环境：
maven 2.X
jdk 1.8
nexus
http://mvnrepository.com/artifact/
http://repository.atlassian.com/maven2
https://repository.jboss.org/nexus/content/repositories/thirdparty-releases/
https://repo1.maven.org/maven2/
http://download.java.net/maven/1
http://download.java.net/maven/2/
http://maven.aliyun.com/nexus/content/groups/public/
https://www.nuget.org/api/v2/
https://repo.spring.io/plugins-release/
http://repo1.maven.org/maven2/
http://repository.jboss.org/maven2
https://simulation.tudelft.nl/maven/


mvn install -Dmaven.test.skip=true
mvn clean install -Dmaven.test.skip=true -e
mvn clean install -Dmaven.test.skip=true -Prelease

以下修改：
pom.xml






ui/assembly/pom.xml
