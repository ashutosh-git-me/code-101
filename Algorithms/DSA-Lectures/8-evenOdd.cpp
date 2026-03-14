#include<iostream>
using namespace std;

string isEven(int num){
    if(num%2==0){
        return "Even";
    }
    return "Odd";
}

int main()
{
    int n;
    cout<<"Enter a number: ";
    cin>>n;
    string ans=isEven(n);
    cout<<endl<<"Number is "<<ans;
}