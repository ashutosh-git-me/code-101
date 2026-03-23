#include<iostream>
#include<map>
using namespace std;

int main()
{
    map<int, string> table;
    table.insert(make_pair(4,"Love"));
    table.insert(make_pair(2,"Hate"));
    table.insert(make_pair(3,"Lust"));
    table.insert(make_pair(1,"Rage"));

    map<int,string>::iterator it=table.begin();
    while(it!=table.end()){
        pair<int,string> p= *it;
        cout<<p.first<<" "<<p.second<<endl;
        it++;
    }
    return 0;
}