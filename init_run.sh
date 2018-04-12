sudo systemctl start docker
sudo ./docker_setup.sh

virtualenv .env
source .env/bin/activate
pip3 install -r requirements.txt
deactivate

cd black
virtualenv .env
source .env/bin/activate
pip3 install -r requirements.txt
deactivate

cd ../
