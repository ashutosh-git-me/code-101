#include<iostream>
using namespace std;

int main()
{
    int n;
    bool isPrime=1;
    cout<<"Enter number to check: ";
    cin>>n;

    for(int i=2;i<n;i++){
        if(n%i==0){
            //cout<<"Not prime!"<<endl;
            isPrime=0;
            break;
        }
    }
    if (isPrime==0){
        cout<<"Not a Prime!"<<endl;
    }
    else    cout<<"Prime!"<<endl;
}