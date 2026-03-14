#include<iostream>
using namespace std;

int main()
{
    int m;
    cout<<"Enter amount: ";
    cin>>m;

    int n;

    switch(1){
        case 1: n=m/100;
                m=m%100;
                cout<<endl<<"100 Rs. Notes are: "<<n<<endl;
        case 2: n=m/50;
                m=m%50;
                cout<<"50 Rs. Notes are: "<<n<<endl;
        case 3: n=m/20;
                m=m%20;
                cout<<"20 Rs. Notes are: "<<n<<endl;
        case 4: n=m/1;
                m=m%1;
                cout<<"1 Rs. Notes are: "<<n<<endl;
                break;
        default: cout<<"Enter valid amount."<<endl;
    }
}