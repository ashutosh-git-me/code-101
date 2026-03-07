//Sum of even numbers till N

#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter a number: ";
    cin>>n;
    int i=2;
    int sum=0;

    while (i<=n)
    {
        sum+=i;
        i+=2;
    }
    
    cout<<endl<<"The even sum is: "<<sum;
}