//fibonacci using for loop
#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"How many numbers:";
    cin>>n;
    int a=0;
    int b=1;

    for(int i=1;i<=n;i++){
        int next=a+b;
        cout<<a<<" ";
        a=b;
        b=next;
    }
}