#!/system/bin/sh


function dochange(){

	echo "file change" 
	cp  output/* /opt/resin/webapps/ROOT/output/ 

}

function monitor(){

	fswatch -o output | xargs -n1 -I{}  cp  output/* /opt/resin/webapps/ROOT/output/&&echo "sync"

}

function showfile(){

   fswatch -o output  --batch-marker=EOF -xn . | while read file event; do 
   echo $file $event
   if [ $file = "EOF" ]; then 
      echo TRIGGER
   fi
	done


}

function showchange(){

	echo "find change， will execute cp  output/* /opt/resin/webapps/ROOT/output/ "
	cp  output/* /opt/resin/webapps/ROOT/output/

}

#fswatch -o output | xargs -n1 -I{}  bash deploy.sh 

showchange


# will not run here

