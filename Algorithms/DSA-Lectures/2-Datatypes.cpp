#include <iostream>
using namespace std;

int main(){
    int a=123;
    cout<<a<<endl;
    char b='v';
    cout<<b<<endl;
    bool c=true;
    cout<<c<<endl;
    float f=2.89;
    cout<<f<<endl;
    double d=1.67;
    cout<<d<<endl;

    int sizea=sizeof(a);
    int sizeb=sizeof(b);
    int sizec=sizeof(c);
    int sized=sizeof(d);
    int sizef=sizeof(f);
    cout<<"Size of "<<a<<":"<<sizea<<'\n';
    cout<<"Size of "<<b<<":"<<sizeb<<'\n';
    cout<<"Size of "<<c<<":"<<sizec<<endl;
    cout<<"Size of "<<d<<":"<<sized<<endl;
    cout<<"Size of "<<f<<":"<<sizef<<endl;
}