#include<iostream>
#include<map>
#include<unordered_map>
using namespace std;

int main()
{
    unordered_map<string, string> table;

    table["in"]="India";
    table["sa"]="South Africa";
    table["us"]="United States";
    table.insert(make_pair("en", "England"));

    pair<string, string> p;
    p.first = "cn";
    p.second = "China";
    table.insert(p);

    //cout<<table.size()<<endl;
    //cout<<table.at("in")<<endl;
    table.at("in")="Hindustan";
    //cout<<table.at("in")<<endl;
    //table.clear();
    //if(table.empty()==true{...}

    unordered_map<string,string>::iterator it=table.begin();
    while(it!=table.end()){
        pair<string,string> p= *it;
        cout<<p.first<<" "<<p.second<<endl;
        it++;
    }

    if(table.find("in")!= table.end()){
        cout<<"Key Found";
    }else cout<<"Key NOT Found!";
    

    if(table.count("em")==0){
        cout<<"Key NOT Found";
    }
    else if(table.count("em")==1){
        cout<<"Key Found";
    }
    return 0;
}