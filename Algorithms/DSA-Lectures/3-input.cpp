#include<iostream>
using namespace std;

int main(){
    int a,b;
    cout<<"Enter the value of a:"<<endl;
    cin>>a;
    cout<<"Enter the value of b:"<<endl;
    cin>>b;
    cout<<"Value of a and b is "<<a<<"and "<<b<<endl;

    if (a>b){
        cout<<"a is greater"<<endl;
    } else if (b>a){
        cout<<"b is greater"<<endl;
    } else cout<<"Both are equal";
    
}

//Cin Doesnt read: Space"_", Tab"\t" and Enter"\n"
//Cin.get() is used
//a = cin.get():
//a = 1 --> 49 ASCII
//a = _ --> 32 ASCII