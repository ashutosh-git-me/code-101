#include<iostream>
using namespace std;

int power(){
    int a, b;
    cout<<"Enter numbers: ";
    cin>>a>>b;
    int ans =1;
    for(int i=1;i<=b;i++){
        ans=ans*a;
    }
    //return ans;
    cout<<endl<<a<<" Raised to power "<<b<<" is: "<<ans;
}

int main()
{
    /*int a,b;
    cout<<"Enter numbers: ";
    cin>>a>>b;

    int answer=power(a,b);
    cout<<endl<<a<<" Raised to power "<<b<<" is: "<<answer;
    */
    int answer = power();
}